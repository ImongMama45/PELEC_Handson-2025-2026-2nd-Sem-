# books/urls.py
from django.urls import path
from .views import BookListView, BookDetailView

app_name = "books"

urlpatterns = [
    # GET all books | POST new book
    path("books/", BookListView.as_view(), name="book-list"),

    # GET one book | DELETE one book
    path("books/<int:pk>/", BookDetailView.as_view(), name="book-detail"),
]