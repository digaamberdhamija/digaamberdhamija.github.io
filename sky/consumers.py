from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.utils import timezone
from .models import Team, Employee, PrivateMessage, TeamMessage

from datetime import datetime

class TeamChatConsumer(AsyncJsonWebsocketConsumer):
    @database_sync_to_async
    def get_team(self, id):
        return Team.objects.filter(pk=int(id)).first()

    @database_sync_to_async
    def get_employee(self, id):
        return Employee.objects.filter(pk=int(id)).first()

    @database_sync_to_async
    def store_team_message_in_database(self, message_dict, sender, receiver):
        message = TeamMessage(
            sender = sender,
            receiver = receiver,
            message = message_dict['message']
        )
        message.save()
        return message

    async def connect(self):
        self.team_id = int(self.scope['url_route']['kwargs']['id'])
        self.team_name = await self.get_team(self.team_id)
        self.team_name = self.team_name.name

        await self.channel_layer.group_add(
            self.team_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.team_name,
            self.channel_name
        )

    async def receive(self, text_data):
        message = await self.decode_json(text_data)
        message['sender_name'] = await self.get_employee(message['sender_id'])
        message['sender_name'] = message['sender_name'].username

        database_message_object = await self.store_team_message_in_database(
            message_dict = message,
            sender = await self.get_employee(message['sender_id']),
            receiver = await self.get_team(message['receiver_id'])
        )
        message['datetime'] = database_message_object.datetime.strftime('%B %d, %Y at %I:%M %p')
        message = await self.encode_json(message)

        await self.channel_layer.group_send(
            self.team_name,
            {
                'type': 'send_to_team',
                'message': message
            }
        )

    async def send_to_team(self, event):
        await self.send(text_data=event['message'])

class PrivateChatConsumer(AsyncJsonWebsocketConsumer):
    new_messages = []
    server_tag = 0
    last_datetime = None

    @database_sync_to_async
    def get_employee(self, id):
        return Employee.objects.filter(pk=int(id)).first()

    @database_sync_to_async
    def store_private_message_in_database(self, message_text, sender, receiver):
        message = PrivateMessage(
            sender = sender,
            receiver = receiver,
            message = message_text
        )
        message.save()
        return message

    async def connect(self):
        self.receiver_id = int(self.scope['url_route']['kwargs']['receiver_id'])
        self.sender_id = int(self.scope['url_route']['kwargs']['sender_id'])
        self.receiver_name = await self.get_employee(self.receiver_id)
        self.receiver_name = self.receiver_name.username

        await self.channel_layer.group_add(
            self.receiver_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.receiver_name,
            self.channel_name
        )

    async def receive(self, text_data):
        message = await self.decode_json(text_data)
        message['server_tag'] = PrivateChatConsumer.server_tag

        if message not in PrivateChatConsumer.new_messages:
            PrivateChatConsumer.new_messages.append(message.copy())
            database_message_object = await self.store_private_message_in_database(
                sender = await self.get_employee(message['sender_id']),
                receiver = await self.get_employee(message['receiver_id']),
                message_text = message['message']
            )
        else:
            PrivateChatConsumer.server_tag += 1

        message['datetime'] = timezone.now().strftime('%B %d, %Y at %I:%M %p')

        message['sender_name'] = await self.get_employee(message['sender_id'])
        message['sender_name'] = message['sender_name'].username

        message = await self.encode_json(message)

        await self.channel_layer.group_send(
            self.receiver_name,
            {
                'type': 'send_message',
                'message': message
            }
        )

    async def send_message(self, event):
        await self.send(text_data=event['message'])

class MessageNotifier(AsyncJsonWebsocketConsumer):
    @database_sync_to_async
    def get_employee(self, id):
        return Employee.objects.filter(pk=int(id)).first()

    @database_sync_to_async
    def get_team(self, id):
        return Team.objects.filter(pk=int(id)).first()

    async def connect(self):
        self.room_name = 'message_notifier'

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        details = await self.decode_json(text_data)
        details['sender_name'] = await self.get_employee(details['sender_id'])
        details['sender_name'] = details['sender_name'].username
        if details['message_type'] == 'team':
            details['receiver_name'] = await self.get_team(details['receiver_id'])
            details['receiver_name'] = details['receiver_name'].name
        elif details['message_type'] == 'private':
            details['receiver_name'] = await self.get_employee(details['receiver_id'])
            details['receiver_name'] = details['receiver_name'].username

        details = await self.encode_json(details)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'notify_new_message',
                'details': details
            }
        )

    async def notify_new_message(self, event):
        await self.send(text_data=event['details'])
