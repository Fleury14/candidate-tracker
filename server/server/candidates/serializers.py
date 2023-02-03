from rest_framework import serializers

from .models import Candidate
from .models import Department
from .models import Note


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            "dept_name",
            "contact",
            "contact_email",
            "id"
        ]

class CandidateSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True, many=False)
    class Meta:
        model = Candidate
        fields = [
            "name",
            "email",
            "department",
            "id"
        ]

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "candidate",
            "content"
        ]