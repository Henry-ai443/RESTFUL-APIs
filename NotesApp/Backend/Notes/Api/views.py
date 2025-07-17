from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Note
from .serializers import NoteSerializer, RegisterSerializer
from django.http import Http404
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
# Create your views here.

class NotesListView(APIView):
    """
    Takes in requests:
        1.Get -> To list all the notes.
        2.Post -> To create a new note.
    """
    permission_classes=[IsAuthenticated]

    def get(self, request):
        notes = Note.objects.filter(owner = request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoteDetail(APIView):

    permission_classes=[IsAuthenticated]

    def get_note_object(self, pk):
        try:
            return Note.objects.get(pk =pk)
        except Note.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        note = self.get_note_object(pk=pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)
    
    def put(self, request, pk):
        note = self.get_note_object(pk=pk)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        note =self.get_note_object(pk=pk)
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, 
        
        status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        note = self.get_note_object(pk=pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user':{
                    'username':user.username,
                    'email':user.email
                },
                'token':token.key
            }, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):

    permission_classes=[AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token':token.key,
                'user':{
                    'username':user.username,
                    'email':user.email
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)