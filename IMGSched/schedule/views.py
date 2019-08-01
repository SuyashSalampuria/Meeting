from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken, MeetingSerializer, CommentSerializer
from .models import meeting, comment
from schedule.permissions import IsOwnerOrAdmin
from django.shortcuts import render
from django.utils.safestring import mark_safe
import json

def index(request):
    return render(request, 'chat/index.html', {})

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name_json': mark_safe(json.dumps(room_name))
    })

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializerWithToken(users, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MeetingList(APIView):
    """
    List all snippets, or create a new snippet.
    """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def get(self, request, format=None):
        meetings = meeting.objects.all()
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MeetingSerializer(data=request.data)
        # service = build_service()
        # event = {
        #                   'summary': request.data.purpose,
        #                   'location': request.data.venue,
        #                   'start': {
        #                     'dateTime': request.data.meet_time,
        #                     'timeZone': 'Asia/Kolkata',
                            
        #                   },
        #                   'end': {
        #                     'dateTime': meet_time,
        #                     'timeZone': 'Asia/Kolkata',
                            
        #                   },
                          
        #                   'reminders': {
        #                     'useDefault': False,
        #                     'overrides': [
        #                       {'method': 'email', 'minutes': 24 * 60},
        #                       {'method': 'popup', 'minutes': 10},
        #                     ],
        #                   },
        #                 }

        # event = service.events().insert(calendarId='primary', body=event).execute()

        if serializer.is_valid():
            serializer.save(owner=self.request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class MeetingDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    permission_classes = (IsOwnerOrAdmin, )
    def get_object(self, pk):
        try:
            return meeting.objects.get(pk=pk)
        except meeting.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        meet = self.get_object(pk)
        serializer = MeetingSerializer(meet)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        meet = self.get_object(pk)
        serializer = MeetingSerializer(meet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        meet = self.get_object(pk)
        meet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CommentList(APIView):
    """
    List all snippets, or create a new snippet.
    """
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    def get(self, request, format=None):
        com = comment.objects.all()
        serializer = CommentSerializer(com, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentDetail(APIView):
    
    #permission_classes = (IsOwnerOrAdmin, )
    def get_object(self, pk):
        try:
            return comment.objects.get(pk=pk)
        except comment.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        com = self.get_object(pk)
        serializer = CommentSerializer(com)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        com = self.get_object(pk)
        serializer = CommentSerializer(com, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        com = self.get_object(pk)
        com.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# def build_service():
#         creds=None
#         if os.path.exists('token.pickle'):
#                 with open('token.pickle', 'rb') as token:
#                         creds = pickle.load(token)
#         if not creds or not creds.valid:
#                 if creds and creds.expired and creds.refresh_token:
#                         creds.refresh(Request())
#                 else:
#                         flow = InstalledAppFlow.from_client_secrets_file(
#                                 'credentials.json', SCOPES)
#                         creds = flow.run_local_server()
        
#                 with open('token.pickle', 'wb') as token:
#                         pickle.dump(creds, token)

#         service = build('calendar', 'v3', credentials=creds)
#         return service