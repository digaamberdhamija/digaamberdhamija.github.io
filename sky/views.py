from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.shortcuts import render
from django.db.models import Q
from .models import *
from datetime import datetime
import json
import copy

def index(request):
    """
    Renders the main dashboard.
    """
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('auth'))

    context = {
        'employees': Employee.objects.exclude(pk=request.user.id).all(),
        'teams': request.user.teams.all(),
        'posts': []
    }

    for post in Post.objects.order_by('-datetime').all():
        context['posts'].append({
            'id': post.id,
            'title': post.title,
            'text': post.text.split('\n'),
            'uploader': post.uploader.username,
            'datetime': post.datetime.strftime('%B %d, %Y at %I:%M %p'),
            'delete': request.user == post.uploader
        })

    print('Rendering base.html')
    return render(request, 'sky/base.html', context)

def authorization(request):
    """
    Renders the authorization page
    """
    if not request.user.is_authenticated:
        context = {}
        print('Rendering authorization.html')
        return render(request, 'sky/auth-base.html', context)
    else:
        print('User already logged in. Redirecting to index page.')
        return HttpResponseRedirect(reverse('index'))

def signup_auth(request):
    """
    Verifies, signs up, and redirects the user to the main dashboard if a POST request is made.
    """
    if request.method == 'POST' and not request.user.is_authenticated:
        email = request.POST.get('email')
        name = request.POST.get('name')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        context = {}
        if not email:
            context['message'] = 'You must enter an email.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not name:
            context['message'] = 'You must enter your name.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not username:
            context['message'] = 'You must enter a username.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif ' ' in username:
            context['message'] = 'Username cannot consist of any spaces.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not username.islower():
            context['message'] = 'Username cannot consist of any uppercase letters.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not password:
            context['message'] = 'You must enter a password.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not confirm_password:
            context['message'] = 'You must confirm your password.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not len(password) > 8:
            context['message'] = 'Your password must be atleast 8 characters long.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not password == confirm_password:
            context['message'] = 'Passwords do not match.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)

        try:
            Employee.objects.get(username=username)
            context['message'] = 'This username is already associated with another account.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        except Employee.DoesNotExist:
            pass

        try:
            Employee.objects.get(email=email)
            context['message'] = 'This email is already associated with another account.'
            print('Signup failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        except Employee.DoesNotExist:
            pass

        # Everything is OK, create new employee
        print('Signing up the user')
        employee = Employee.objects.create_user(username=username, email=email, password=password)
        employee.name = name

        # Login the employee
        login(request, employee)
        return HttpResponseRedirect(reverse('index'))

    elif request.user.is_authenticated:
        print('User already logged in. Redirecting to index page.')
        return HttpResponseRedirect(reverse('index'))

def login_auth(request):
    """
    Verifies, logs in, and redirects the user to the main dashboard if a POST request is made.
    """
    if request.method == 'POST' and not request.user.is_authenticated:
        username = request.POST.get('username')
        password = request.POST.get('password')

        context = {}
        if not username:
            context['message'] = 'You must enter a username.'
            print('Login failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)
        elif not password:
            context['message'] = 'You must enter a password.'
            print('Login failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)

        employee = authenticate(request, username=username, password=password)
        if employee is None:
            context['message'] = 'Username/Password does not match.'
            print('Login failed. Rendering authorization.html')
            return render(request, 'sky/auth-base.html', context)

        # Everything OK, log the user in
        print('Logging in the employee')
        login(request, employee)
        return HttpResponseRedirect(reverse('index'))

    elif request.user.is_authenticated:
        print('User already logged in. Redirecting to index page.')
        return HttpResponseRedirect(reverse('index'))

def logout_auth(request):
    if request.user.is_authenticated:
        logout(request)
        print('Logged out. Rendering authorization.html')
        context = {'message': 'Logged out successfully.'}
        return render(request, 'sky/auth-base.html', context)
    else:
        print('User not logged in. Rendering authorization page.')
        context = {'message': 'You must login first.'}
        return render(request, 'sky/auth-base.html', context)

def get_messages(request):
    """
    Sends all the messages of a given team as a JSON response.
    """
    if request.user.is_authenticated:
        message_type = request.GET.get('message_type')

        response = {'messages': []}
        if message_type == 'team':
            team_id = int(request.GET.get('id'))
            # Check if the user is a part of the team
            try:
                team = Team.objects.filter(pk=team_id).first()
                team.employees.filter(pk=request.user.id).first()
            except:
                return

            for message in TeamMessage.objects.filter(receiver=team).order_by('datetime').all():
                response['messages'].append({
                    'message_type': message_type,
                    'sender_name': message.sender.username,
                    'sender_id': message.sender.id,
                    'receiver_id': message.receiver.id,
                    'message': message.message,
                    'datetime': message.datetime.strftime('%B %d, %Y at %I:%M %p'),
                    'sent': message.sender == request.user
                });

        elif message_type == 'private':
            id1 = int(request.GET.get('id1'))
            id2 = int(request.GET.get('id2'))

            employee1 = Employee.objects.filter(pk=id1).first()
            employee2 = Employee.objects.filter(pk=id2).first()

            if not (employee1 == request.user or employee2 == request.user):
                return

            for message in PrivateMessage.objects.filter(sender__in=[employee1, employee2]).filter(receiver__in=[employee1, employee2]).order_by('datetime').all():
                response['messages'].append({
                    'message_type': message_type,
                    'sender_name': message.sender.username,
                    'sender_id': message.sender.id,
                    'receiver_id': message.receiver.id,
                    'message': message.message,
                    'datetime': message.datetime.strftime('%B %d, %Y at %I:%M %p'),
                    'sent': message.sender == request.user
                })

        return JsonResponse(response);

def search_query(request):
    """
    Returns the teams and employees matching the search query as a JsonResponse
    """
    if request.user.is_authenticated:
        query = request.GET.get('query')

        response = {
            'teams': [],
            'employees': []
        }
        for team in request.user.teams.filter(name__contains = query).all():
            response['teams'].append({'id': team.id, 'name': team.name})
        for employee in Employee.objects.filter(username__contains = query).exclude(pk=request.user.id).all():
            response['employees'].append({'id': employee.id, 'username': employee.username})

        return JsonResponse(response)

def new_post(request):
    """
    Adds a new post to the database via a POST request, and returns its details as a JsonResponse
    """
    if not request.user.is_authenticated:
        return

    title = request.POST.get('title')
    text = request.POST.get('text')
    if not title or not text:
        return

    post = Post(uploader=request.user, title=title, text=text)
    post.save()
    print(post)
    return JsonResponse({
        'id': post.id,
        'uploader': post.uploader.username,
        'title': post.title,
        'text': post.text.split('\n'),
        'datetime': post.datetime.strftime('%B %d, %Y at %I:%M %p'),
        'delete': request.user == post.uploader
    })

def delete_post(request):
    """
    Deletes a post with a given ID and returns the status as a JsonResponse.
    """
    response = {'status': None}
    if not request.user.is_authenticated:
        response['status'] == 'fail'
        return JsonResponse(response)

    try:
        id = int(request.POST.get('id'))
        post = request.user.posts.get(pk=id)
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    post.delete()
    response['status'] = 'success'
    return JsonResponse(response)

def get_all_posts(request):
    """
    Returns all the posts matching the search query as a JsonResponse
    """
    if not request.user.is_authenticated:
        return

    query = request.GET.get('query')
    response = {'posts': []}
    for post in Post.objects.filter(Q(title__contains=query) | Q(text__contains=query)).order_by('-datetime').all():
        response['posts'].append({
            'id': post.id,
            'title': post.title,
            'text': post.text.split('\n'),
            'uploader': post.uploader.username,
            'datetime': post.datetime.strftime('%B %d, %Y at %I:%M %p'),
            'delete': request.user == post.uploader
        })

    return JsonResponse(response)

def get_employees(request):
    """
    Returns the list of all employees(username and id) except the user logged in as a Json response, matching the search query
    """
    if not request.user.is_authenticated:
        return

    query = request.GET.get('query')
    response = {'employees': []}
    for employee in Employee.objects.filter(username__contains=query).exclude(pk=request.user.id).all():
        response['employees'].append({
            'username': employee.username,
            'id': employee.id
        })
    return JsonResponse(response)

def create_team(request):
    """
    Creates a team and return the status and as a JsonResponse
    """
    response = {'status': None}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    try:
        team_data = json.loads(request.POST.get('team_data'))
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    if len(team_data['employees']) < 1 or ' ' in team_data['team_name']:
        response['status'] = 'fail'
        return JsonResponse(response)

    employees = [request.user]
    for employee in team_data['employees']:
        try:
            employees.append(Employee.objects.get(pk=int(employee['id'])))
        except:
            response['status'] = 'fail'
            return JsonResponse(response)

    try:
        Team.objects.get(name=team_data['team_name'])
        response['status'] = 'fail'
        response['error'] = f'a team named \'{team_data["team_name"]}\' already exists. try a different team name.'
        return JsonResponse(response)
    except:
        pass

    team = Team(name = team_data['team_name'])
    team.save()

    for employee in employees:
        team.employees.add(employee)

    response['status'] = 'success'
    return JsonResponse(response)

def get_teams(request):
    """
    Returns the teams matching the search query that the user is a part of, and not a part of separately as a JsonResponse
    """
    response = {'status': None}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    query = request.GET.get('query')

    response['my_teams'] = []
    my_teams = request.user.teams.filter(name__contains=query).all()
    for team in my_teams:
        team_dict = {
            'id': team.id,
            'name': team.name,
            'members': []
        }
        for employee in team.employees.exclude(pk=request.user.id).all():
            team_dict['members'].append(employee.username)
        response['my_teams'].append(copy.deepcopy(team_dict))

    response['other_teams'] = []
    other_teams = Team.objects.filter(name__contains=query).exclude(pk__in=my_teams).all()
    for team in other_teams:
        team_dict = {
            'id': team.id,
            'name': team.name,
            'members': []
        }
        for employee in team.employees.exclude(pk=request.user.id).all():
            team_dict['members'].append(employee.username)
        response['other_teams'].append(copy.deepcopy(team_dict))

    response['status'] = 'success'
    return JsonResponse(response)

def get_notes(request):
    """
    Return all the notes of the user currently logged in matching the search query sorted according to datetime (descending)
    """
    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    query = request.GET.get('query')

    response['notes'] = []
    for note in request.user.notes.filter(Q(title__contains=query) | Q(text__contains=query)).order_by('-datetime').all():
        response['notes'].append({
            'id': note.id,
            'title': note.title,
            'text': note.text.split('\n'),
            'datetime': note.datetime.strftime('%B %d, %Y at %I:%M %p')
        })

    return JsonResponse(response)

def create_note(request):
    """
    Creates the note and return the status as a JsonResponse
    """
    response = {'status': None}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    title = request.POST.get('title')
    text = request.POST.get('text')

    if not title or not text:
        response['status'] = 'fail'
        return JsonResponse(response)

    note = Note(uploader=request.user, title=title, text=text)
    note.save()
    print(note)

    response['status'] = 'success'
    return JsonResponse(response)

def delete_note(request):
    """
    Deletes the note based on the id and returns the status as a JsonResponse
    """
    response = {'status': None}

    if not request.user.is_authenticated:
        response['status'] == 'fail'
        return JsonResponse(response)

    try:
        note_id = int(request.POST.get('id'))
        note = request.user.notes.get(pk=note_id)
    except:
        response['status'] == 'fail'
        return JsonResponse(response)

    note.delete()
    response['status'] = 'success'
    return JsonResponse(response)

def get_my_posts(request):
    """
    Returns all the posts matching the query of the user currently logged in as a JsonResponse
    """
    response = {'status': None}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    query = request.GET.get('query')
    posts = []
    for post in request.user.posts.filter(Q(title__contains=query) | Q(text__contains=query)).order_by('-datetime').all():
        posts.append({
            'id': post.id,
            'title': post.title,
            'text': post.text.split('\n'),
            'datetime': post.datetime.strftime('%B %d, %Y at %I:%M %p')
        })

    response['posts'] = posts
    return JsonResponse(response)

def change_username(request):
    """
    Changes the username and renderes te authorization screen if that username is available
    """
    if not request.user.is_authenticated:
        print('User not authenticated. Redirecting to the authorization page')
        return HttpResponseRedirect(reverse('auth'))

    new_username = request.POST.get('new_username')

    context = {}
    try:
        Employee.objects.get(username=new_username)
        print('Username already taken. Logging out the user, and rendering authorization page')
        logout(request)
        context['message'] = 'This username is already taken.'
        return render(request, 'sky/auth-base.html', context)
    except:
        pass

    request.user.username = new_username
    request.user.save()
    logout(request)
    print('Username changed. Logging out the user, and rendering authorization page')
    context['message'] = 'Username changed successfully.'
    return render(request, 'sky/auth-base.html', context)

def change_password(request):
    """
    Changes the password, logs the user out, and renders the authorization page.
    """
    context = {}
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('auth'))

    current_password = request.POST.get('current_password')
    new_password = request.POST.get('new_password')
    confirm_new_password = request.POST.get('confirm_new_password')

    if not current_password:
        context['message'] = 'You must enter your current password.'
        print('Current password not entered. Logging out the user, and rendering authorization page')
        logout(request)
        return render(request, 'sky/auth-base.html', context)
    elif not new_password:
        context['message'] = 'You must enter your new password.'
        print('New password not entered. Logging out the user, and rendering authorization page')
        logout(request)
        return render(request, 'sky/auth-base.html', context)
    elif not confirm_new_password:
        context['message'] = 'You must confirm your new password.'
        print('New password not confirmed. Logging out the user, and rendering authorization page')
        logout(request)
        return render(request, 'sky/auth-base.html', context)
    elif len(new_password) < 8:
        context['message'] = 'New password should be atleast 8 characters long.'
        print('New password should be atleast 8 characters long. Logging out the user, and rendering authorization page')
        logout(request)
        return render(request, 'sky/auth-base.html', context)
    elif not new_password == confirm_new_password:
        context['message'] = 'New passwords do not match.'
        print('New passwords do not match. Logging out the user, and rendering authorization page')
        logout(request)
        return render(request, 'sky/auth-base.html', context)
    elif not request.user.check_password(current_password):
        context['message'] = 'Current password does not match.'
        print('Current password does not match. Logging out the user, and rendering authorization page')
        logout(request)
        return render(request, 'sky/auth-base.html', context)

    request.user.set_password(new_password)
    request.user.save()
    context['message'] = 'Password changed successfully.'
    print('Password changed successfully. Logging out the user, and rendering authorization page')
    logout(request)
    return render(request, 'sky/auth-base.html', context)

def start_new_project(request):
    """
    Creates a new project a returns the status as a JsonResponse
    """
    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    title = request.POST.get('title')
    description = request.POST.get('description')

    try:
        teams_json = json.loads(request.POST.get('teams'))
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    if (not title) or (not description) or len(teams_json['my_teams']) < 1:
        response['status'] = 'fail'
        return JsonResponse(response)

    my_teams = []
    for team in teams_json['my_teams']:
        try:
            my_teams.append(Team.objects.get(pk=int(team['id'])))
        except:
            response['status'] = 'fail'
            return JsonResponse(response)

    other_teams = []
    for team in teams_json['other_teams']:
        try:
            other_teams.append(Team.objects.get(pk=int(team['id'])))
        except:
            response['status'] = 'fail'
            return JsonResponse(response)

    try:
        Project.objects.get(title=title)
        response['status'] = 'fail'
        response['error'] = f'a project titled \'{title}\' already exists. try a different project title.'
        return JsonResponse(response)
    except:
        pass

    project = Project(starter=request.user, title=title, description=description)
    project.save()

    for team in my_teams:
        project.teams.add(team)
    for team in other_teams:
        project.teams.add(team)

    project.save()

    response['status'] = 'success'
    return JsonResponse(response)

def get_all_projects(request):
    """
    Returns my_projects and other_projects matching the search query as a JsonResponse
    """
    def make_project_dict(project):
        project_dict = {
            'id': project.id,
            'title': project.title,
            'description': project.description.split('\n'),
            'datetime': project.datetime.strftime('%B %d, %Y at %I:%M %p'),
            'starter': project.starter.username,
            'open': project.status == 'O',
            'teams': []
        }
        for team in project.teams.all():
            project_dict['teams'].append({
                'name': team.name,
                'id': team.id
            })
        if project.status == 'O':
            project_dict['status'] = 'open'
        elif project.status == 'C':
            project_dict['status'] = 'closed'

        return project_dict

    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    query = request.GET.get('query')

    projects = Project.objects.filter(title__contains=query).order_by('-datetime').all()
    my_teams = request.user.teams.all()
    other_teams = Team.objects.exclude(pk__in=my_teams).all()

    response['my_projects'] = []
    response['other_projects'] = []

    for project in projects:
        my_team = False
        for team in project.teams.all():
            if team in my_teams:
                my_team = True
                break
        if my_team:
            response['my_projects'].append(copy.deepcopy(make_project_dict(project)))
        else:
            response['other_projects'].append(copy.deepcopy(make_project_dict(project)))

    return JsonResponse(response)

def get_project_info(request):
    """
    Returns the project's information matching the id as a JsonResponse.
    """
    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    try:
        id = int(request.GET.get('id'))
        project = Project.objects.get(pk=id)
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    user_authorized = False
    for team in request.user.teams.all():
        if team in project.teams.all():
            user_authorized = True
            break
    if not user_authorized:
        response['status'] = 'fail'
        return JsonResponse(response)

    project_dict = {
        'title': project.title,
        'description': project.description.split('\n'),
        'starter': project.starter.username,
        'datetime': project.datetime.strftime('%B %d, %Y at %I:%M %p'),
        'open': project.status == 'O',
        'teams': []
    }

    if project.status == 'O':
        project_dict['project_status'] = 'open'
    elif project.status == 'C':
        project_dict['project_status'] = 'closed'

    for team in project.teams.all():
        project_dict['teams'].append(team.name)
    project_dict['status'] = 'success'
    return JsonResponse(project_dict)

def get_project_updates(request):
    """
    Returns all the project's updates matching the id as a JsonResponse
    """
    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    try:
        id = int(request.GET.get('id'))
        project = Project.objects.get(pk=id)
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    user_authorized = False
    for team in request.user.teams.all():
        if team in project.teams.all():
            user_authorized = True
            break

    if not user_authorized:
        response['status'] = 'fail'
        return JsonResponse(response)

    response['updates'] = []
    for update in project.updates.order_by('-datetime').all():
        response['updates'].append({
            'uploader': update.uploader.username,
            'update': update.update,
            'datetime': update.datetime.strftime('%B %d, %Y at %I:%M %p')
        })

    response['status'] = 'success'
    return JsonResponse(response)

def add_project_update(request):
    """
    Saves the update to the database and returns the status as a JsonResponse
    """
    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    try:
        id = int(request.POST.get('id'))
        update = request.POST.get('update')
        project = Project.objects.get(pk=id)
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    user_authorized = False
    for team in request.user.teams.all():
        if team in project.teams.all():
            user_authorized = True
            break

    if not update or not user_authorized or not project.status == 'O':
        response['status'] = 'fail'
        return JsonResponse(response)

    project_update = ProjectUpdate(uploader=request.user, update=update, project=project)
    project_update.save()

    response['status'] = 'success'
    return JsonResponse(response)

def change_project_status(request):
    """
    Changes the status of the project based on the id and returns the request status as a JsonResponse
    """
    response = {}
    if not request.user.is_authenticated:
        response['status'] = 'fail'
        return JsonResponse(response)

    try:
        id = int(request.POST.get('id'))
        project = Project.objects.get(pk=id)
    except:
        response['status'] = 'fail'
        return JsonResponse(response)

    user_authorized = False
    for team in request.user.teams.all():
        if team in project.teams.all():
            user_authorized = True
            break

    if not user_authorized:
        response['status'] = 'fail'
        return JsonResponse(response)

    if project.status == 'O':
        project.status = 'C'
        project_update = ProjectUpdate(uploader=request.user, project=project, update=f'{request.user.username} closed the project.')
    elif project.status == 'C':
        project.status = 'O'
        project_update = ProjectUpdate(uploader=request.user, project=project, update=f'{request.user.username} reopened the project.')
    project_update.save()
    project.save()

    response['status'] = 'success'
    return JsonResponse(response)
