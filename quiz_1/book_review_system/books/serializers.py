# books/serializers.py
from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    """
    Serializer for the Book model.
    - Converts Book instances to JSON (serialization)
    - Validates incoming data before saving (deserialization)
    - Includes every model field in API responses
    """

    class Meta:
        model = Book          # Which model to serialize
        fields = "__all__"    # Includes: id, title, author, rating, is_featured

    # -------------------------------------------------------
    # Custom validators — called automatically by is_valid()
    # -------------------------------------------------------

    def validate_rating(self, value):
        """Rating must be between 0.0 and 5.0"""
        if value < 0.0 or value > 5.0:
            raise serializers.ValidationError(
                "Rating must be between 0.0 and 5.0."
            )
        return value

    def validate_title(self, value):
        """Title cannot be blank or whitespace"""
        if not value.strip():
            raise serializers.ValidationError(
                "Title cannot be empty or whitespace."
            )
        return value.strip()

    def validate_author(self, value):
        """Author cannot be blank or whitespace"""
        if not value.strip():
            raise serializers.ValidationError(
                "Author cannot be empty or whitespace."
            )
        return value.strip()