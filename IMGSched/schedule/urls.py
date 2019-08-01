from django.urls import path
from schedule import views
from .views import current_user, UserList, MeetingList,MeetingDetail, CommentList,CommentDetail
from django.conf.urls import url
from . import views

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('all/', views.MeetingList.as_view()),
    path('<int:pk>/', views.MeetingDetail.as_view()),
    path('comments/all/', views.CommentList.as_view()),
    path('comments/<int:pk>/', views.CommentDetail.as_view()),
    path('chat/<int:room_name>', views.room, name='room'),

]