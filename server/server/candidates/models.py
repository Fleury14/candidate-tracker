from django.db import models
from django_extensions.db.models import TimeStampedModel
from simple_history.models import HistoricalRecords

# Create your models here.

class Department(TimeStampedModel, models.Model):
    dept_name = models.CharField(max_length=255)
    contact = models.CharField(max_length=255)
    contact_email = models.EmailField(unique=False)

    def __str__(self):
        return self.dept_name

    class Meta:
        ordering = ["dept_name"]
        indexes = [
            models.Index(fields=["dept_name"]),
            models.Index(fields=["contact"]),
        ]

    

class Candidate(TimeStampedModel, models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_DEFAULT, default=1)

    history = HistoricalRecords()

    def __str__(self):
        return self.email

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["email"]),
        ]

class Note(TimeStampedModel, models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    content = models.CharField(max_length=5000)

    history = HistoricalRecords()

    def __str__(self):
        return self.content

    class Meta:
        ordering = ["candidate"]
        indexes = [
            models.Index(fields=["candidate"])
        ]
