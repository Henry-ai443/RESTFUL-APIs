from django.urls import path
from .views import ToDoList, ToDoDetail

urlpatterns = [
    path('todos/', ToDoList.as_view(), name="todo_list"),
    path('todos/<int:pk>/', ToDoDetail.as_view(), name="todo_detail")
]