import os


def read_input(day):
    filename = os.path.join(os.path.dirname(__file__), 'input/day{0}.txt'.format(day))
    with open(filename) as f:
        lines = f.read().splitlines()
    return lines
