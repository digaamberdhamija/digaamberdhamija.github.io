from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('auth/', views.authorization, name='auth'),
    path('signup/', views.signup_auth, name='signup'),
    path('login/', views.login_auth, name='login'),
    path('logout/', views.logout_auth, name='logout'),
    path('get_messages', views.get_messages, name='get_messages'),
    path('search', views.search_query, name='search'),
    path('new_post', views.new_post, name="new_post"),
    path('delete_post', views.delete_post, name="delete_post"),
    path('get_all_posts', views.get_all_posts, name="get_all_posts"),
    path('get_employees', views.get_employees, name="get_employees"),
    path('create_team', views.create_team, name="create_team"),
    path('get_teams', views.get_teams, name="get_teams"),
    path('create_note', views.create_note, name='create_note'),
    path('get_notes', views.get_notes, name='get_notes'),
    path('delete_note', views.delete_note, name='delete_note'),
    path('get_my_posts', views.get_my_posts, name='get_my_posts'),
    path('change_username/', views.change_username, name='change_username'),
    path('change_password/', views.change_password, name='change_password'),
    path('start_new_project', views.start_new_project, name='start_new_project'),
    path('get_all_projects', views.get_all_projects, name='get_all_projects'),
    path('get_project_info', views.get_project_info, name='get_project_info'),
    path('get_project_updates', views.get_project_updates, name='get_project_updates'),
    path('add_project_update', views.add_project_update, name='add_project_update'),
    path('change_project_status', views.change_project_status, name='change_project_status')
]
