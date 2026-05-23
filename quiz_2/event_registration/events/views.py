from django.shortcuts import render, redirect
from .forms import EventRegistrationForm


def register(request):
    if request.method == 'POST':
        form = EventRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = EventRegistrationForm()

    return render(request, 'events/register.html', {'form': form})


def success(request):
    return render(request, 'events/success.html')
