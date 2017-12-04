import os


def read_input(day, char_split=False):
    def handle_value(raw):
        try:
            return int(raw)
        except ValueError:
            return raw

    def handle_line(raw):
        split = list(raw) if char_split else raw.split()
        processed = list(map(handle_value, split))

        return processed[0] if len(processed) == 1 else processed

    lines = list(map(handle_line, read_raw_input(day)))

    return lines[0] if len(lines) == 1 else lines


def read_raw_input(day):
    filename = os.path.join(os.path.dirname(__file__), 'input/day{0}.txt'.format(day))
    with open(filename) as f:
        lines = f.read().splitlines()
    return lines
