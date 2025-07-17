from django.urls import path
from .views import NotesListView, NoteDetail, RegisterView, LoginView

urlpatterns = [
    path('notes/', NotesListView.as_view(), name="notes"),
    path('notes/<int:pk>/', NoteDetail.as_view(), name="note_detail"),
    path('register/',RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name="login"),
]