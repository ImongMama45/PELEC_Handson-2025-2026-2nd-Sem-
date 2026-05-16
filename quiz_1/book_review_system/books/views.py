# books/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Book
from .serializers import BookSerializer


# ============================================================
# BookListView  →  handles /api/books/
# ============================================================

class BookListView(APIView):
    """
    GET  /api/books/  → returns all books
    POST /api/books/  → creates a new book
    """

    def get(self, request):
        """Retrieve all books → return as JSON with 200 OK"""
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)  # many=True for lists
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Validate incoming data → save to DB → return 201 Created"""
        serializer = BookSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Book created successfully!",
                    "book": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Validation failed. Please check the errors below.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


# ============================================================
# BookDetailView  →  handles /api/books/<id>/
# ============================================================

class BookDetailView(APIView):
    """
    GET    /api/books/<id>/  → retrieve a single book
    DELETE /api/books/<id>/  → delete a book
    """

    def _get_book_or_404(self, pk):
        """Helper: fetch book by pk, return None if missing"""
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return None

    def get(self, request, pk):
        """Return one book by ID"""
        book = self._get_book_or_404(pk)
        if book is None:
            return Response(
                {"error": f"Book with id={pk} was not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete one book by ID"""
        book = self._get_book_or_404(pk)
        if book is None:
            return Response(
                {"error": f"Book with id={pk} was not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        title = book.title
        book.delete()
        return Response(
            {"message": f'Book "{title}" has been deleted successfully.'},
            status=status.HTTP_200_OK,
        )