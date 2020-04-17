from django.db import models

class Rec_Model(models.Model):
	receipt=models.TextField(max_length=100)
	
	
	def __str__(self):
		return self.receipt
