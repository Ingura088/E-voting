from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Student, Aspirant, Vote
import json


# LOGIN
@csrf_exempt
def login(request):

    if request.method == "POST":

        data = json.loads(request.body)

        admission_no = data.get("admission_no")
        password = data.get("password")

        try:
            student = Student.objects.get(
                admission_no=admission_no,
                password=password
            )

            return JsonResponse({
    "token": "logged_in",
    "student_id": student.id
})

        except Student.DoesNotExist:

            return JsonResponse({
                "error": "Invalid credentials"
            }, status=401)

    return JsonResponse({
        "error": "Method not allowed"
    }, status=405)
@csrf_exempt
def register(request):

    if request.method == "POST":

        data = json.loads(request.body)

        admission_no = data.get("admission_no")
        password = data.get("password")

        # Check if student already exists
        if Student.objects.filter(admission_no=admission_no).exists():
            return JsonResponse({
                "message": "Student already exists"
            })

        # Create new student
        student = Student.objects.create(
            admission_no=admission_no,
            password=password
        )

        return JsonResponse({
            "message": "Registration successful"
        })

    return JsonResponse({
        "message": "Use POST request"
    })



# ASPIRANTS
def aspirants(request):

    data = []

    for a in Aspirant.objects.all():

        data.append({
            "id": a.id,
            "name": a.name,
            "position": a.position,
            "photo": ""
        })

    return JsonResponse(data, safe=False)



# VOTING
@csrf_exempt
def vote(request):

    if request.method == "POST":

        data = json.loads(request.body)

        student_id = data["student_id"]
        aspirant_id = data["aspirant"]

        student = Student.objects.get(
            id=student_id
        )

        aspirant = Aspirant.objects.get(
            id=aspirant_id
        )

        # Only block duplicate vote in SAME position
        already_voted = Vote.objects.filter(
            student=student,
            aspirant__position=aspirant.position
        ).exists()

        if already_voted:

            return JsonResponse({
                "message": "You already voted for this position."
            })

        Vote.objects.create(
            student=student,
            aspirant=aspirant
        )

        return JsonResponse({
            "message": "Vote cast successfully!"
        })

    return JsonResponse({
        "message": "Use POST request only."
    })
def results(request):

    total_votes = Vote.objects.count()

    data = []

    for a in Aspirant.objects.all():

        votes = Vote.objects.filter(
            aspirant=a
        ).count()

        if total_votes > 0:
            percent = round(
                (votes / total_votes) * 100
            )
        else:
            percent = 0

        data.append({
            "aspirant": a.name,
            "votes": votes,
            "percent": percent
        })

    return JsonResponse(
        data,
        safe=False
    )