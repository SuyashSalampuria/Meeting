from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import meeting
from .models import comment

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id','username','is_staff')


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token','username', 'password','id','is_staff')

class MeetingSerializer(serializers.ModelSerializer):
    
	class Meta:
		model = meeting
		fields = ('id','owner', 'time_created', 'purpose',  'venue','private','meet_time','participants')

class CommentSerializer(serializers.ModelSerializer):
    
	class Meta:
		model = comment
		fields = ('id', 'time', 'meeting',  'Comment','user')
