from django.shortcuts import render
# from django.forms.models import model_to_dict
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
from rest_framework import generics, permissions

from server.candidates.models import Candidate, Department, Note
from server.candidates.serializers import CandidateSerializer, DepartmentSerializer, NoteSerializer

# Create your views here.

class CandidateListCreateAPIView(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    # permission_classes = [permissions.IsAuthenticated]

candidate_list_create_view = CandidateListCreateAPIView.as_view()

class CandidateDetailAPIView(generics.RetrieveAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

candidate_detail_view = CandidateDetailAPIView.as_view()

class CandidateUpdateAPIView(generics.UpdateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    lookup_field = 'pk'

candidate_update_view = CandidateUpdateAPIView.as_view()

class CandidateDestroyAPIView(generics.DestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    lookup_field = 'pk'

candidate_destroy_view = CandidateDestroyAPIView.as_view()

# Department views

class DepartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

department_list_create_view = DepartmentListCreateAPIView.as_view()

class DepartmentDetailAPIView(generics.RetrieveAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

department_detail_view = DepartmentDetailAPIView.as_view()

# Note Views

class NoteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

note_list_create_view = NoteListCreateAPIView.as_view()

class NoteDetailAPIView(generics.ListAPIView):
    serializer_class = NoteSerializer
    lookup_field = "candidate"
    def get_queryset(self):
        candidate = self.kwargs['candidate']
        return Note.objects.filter(candidate=candidate)

note_detail_view = NoteDetailAPIView.as_view()

class NoteUpdateAPIView(generics.UpdateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    lookup_field = 'pk'

note_update_view = NoteUpdateAPIView.as_view()

class NoteDestroyAPIView(generics.DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    lookup_field = 'pk'

note_destroy_view = NoteDestroyAPIView.as_view()

# @api_view(["GET"])
# def get_all_candidates(request, *args, **kwargs):
#     instance = Candidate.objects.all().order_by("?").first()
#     data = {}
#     if instance:
#         # data = model_to_dict(candidate_data, fields=['name', 'email'])
#         data = CandidateSerializer(instance).data

#     return Response(data)

# @api_view(["POST"])
# def save_candidate(request, *args, **kwargs):
#     serializer = CandidateSerializer(data=request.data)
#     if serializer.is_valid(raise_exception=True):
#         return Response(serializer.data)
#     return Response({"error": "invalid data"})