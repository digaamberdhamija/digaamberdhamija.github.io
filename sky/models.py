from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Employee(AbstractUser, models.Model):
    pass

class Team(models.Model):
    name = models.CharField(max_length=65)
    employees = models.ManyToManyField(Employee, blank=True, related_name='teams')

    def __str__(self):
        return f"{self.id}: {self.name}"

class Message(models.Model):
    sender = models.ForeignKey(Employee, on_delete=models.CASCADE)
    message = models.CharField(max_length=256)
    datetime = models.DateTimeField(default=timezone.now)

class PrivateMessage(Message):
    receiver = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='private_messages')

    def __str__(self):
        return f'sender: {self.sender}, receiver: {self.receiver}, message: {self.message}, datetime: {self.datetime}'

class TeamMessage(Message):
    receiver = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team_messages')

    def __str__(self):
        return f'sender: ({self.sender}), receiver_team: ({self.receiver}), message: {self.message}, datetime: {self.datetime}'

class Post(models.Model):
    uploader = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=256)
    text = models.TextField(max_length=8192)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Post {self.id}: {self.title} by {self.uploader} on {self.datetime}'

class Note(models.Model):
    uploader = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=256)
    text = models.TextField(max_length=4096)
    datetime = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Note {self.id}: {self.title} by {self.uploader} on {self.datetime}'

class Project(models.Model):
    status_choices = [
        ('O', 'Open'),
        ('C', 'Closed')
    ]

    starter = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, related_name='started_projects')
    teams = models.ManyToManyField(Team, blank=True, related_name='projects')
    title = models.CharField(max_length=256)
    description = models.TextField(max_length=8192)
    datetime = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=1, choices=status_choices, default='O')

    def __str__(self):
        return f'{self.status} project {self.id}: {self.title} started on {self.datetime} by {self.starter}'

class ProjectUpdate(models.Model):
    uploader = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, related_name='updates')
    datetime = models.DateTimeField(default=timezone.now)
    update = models.CharField(max_length=2048)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
