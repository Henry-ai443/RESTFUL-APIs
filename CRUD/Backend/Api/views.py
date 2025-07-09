from django.shortcuts import render
from .models import ToDo
from .serializer import ToDoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework import status
# Create your views here.

class ToDoList(APIView):
    """
    List All ToDos or create a New ToDo
    """
    def get(self, request):
        todos = ToDo.objects.all()
        serializer = ToDoSerializer(todos, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serilizer = ToDoSerializer(data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            return Response(serilizer.data, status=status.HTTP_201_CREATED)
        print(serilizer.errors)
        return Response(serilizer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ToDoDetail(APIView):
    """
    Retrieve, update or delete a ToDo intsance
    """
    def get_object(self, pk):
        try:
            return ToDo.objects.get(pk = pk)
        except ToDo.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        todo = self.get_object(pk)
        serializer = ToDoSerializer(todo)
        return Response(serializer.data)

    def put(self, request, pk):
        todo = self.get_object(pk)
        serializer = ToDoSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        todo = self.get_object(pk=pk)
        serializer = ToDoSerializer(todo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        todo = self.get_object(pk)
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
