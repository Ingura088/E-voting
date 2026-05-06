from django.db import models


class Student(models.Model):
    admission_no = models.CharField(max_length=50, unique= True)
    password = models.CharField(max_length=50)

    def __str__(self):
        return self.admission_no


class Aspirant(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Vote(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE
    )

    aspirant = models.ForeignKey(
        Aspirant,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.student} voted for {self.aspirant}"