# books/models.py
from django.db import models


class Book(models.Model):
    """
    Represents a single book in our review system.

    Fields:
        title      – The name of the book (required)
        author     – Who wrote the book (required)
        rating     – A decimal score, e.g. 4.5 (required)
        is_featured – Whether this book is highlighted on the platform
    """

    # CharField stores text up to a max length
    title = models.CharField(
        max_length=255,
        help_text="Full title of the book"
    )

    author = models.CharField(
        max_length=255,
        help_text="Name of the author"
    )

    # FloatField stores decimal numbers like 3.7 or 4.5
    rating = models.FloatField(
        help_text="Rating from 0.0 to 5.0"
    )

    # BooleanField stores True or False; default is False
    is_featured = models.BooleanField(
        default=False,
        help_text="Mark True to feature this book"
    )

    def __str__(self):
        """
        Human-readable label for admin and shell.
        Example: print(book) → "Clean Code"
        """
        return self.title

    class Meta:
        ordering = ["-id"]       # Newest books appear first
        verbose_name = "Book"
        verbose_name_plural = "Books"