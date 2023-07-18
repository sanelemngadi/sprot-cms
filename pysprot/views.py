from django.shortcuts import render

# Create your views here.
def deshboard_view(request):
    return render(request, "", {})

def design_view(request):
    return render(request, "design/design.html", {})


"""
    we need to create a permanet html file with customization
    toggle between edit mode and user mode

    each section must have:
        data-setting="{"background-color": black,}"

    each element must have data-element_type="column, section, row"
    each element must have data-elemet_devices_settings="{"small":{}, "medium":{}, "large":{}}"

    must be able to get selected text = ""

    all elements must have "edit icon, and the settings in side bar

    must be able to define break points, define querysets for any breakpoint

    use font-awesome
"""