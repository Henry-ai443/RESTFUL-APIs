from rest_framework import serializers
from .models import Note
from django.contrib.auth.models import User

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id','topic', 'entry', 'created_at']
        write_only_fields = ['created_at', 'owner']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def validated_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already in use.')
        return value
    
    def create(self, validate_data):
        user = User.objects.create_user(
            username=validate_data['username'],
            email = validate_data['email'],
            password = validate_data['password']
        )
        return user