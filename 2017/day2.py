import common


def build(lines):
    return [list(map(int, line.split())) for line in lines]


def checksum(line):
    return max(line) - min(line)


def check_solve(lines):
    return sum(map(checksum, lines))


data = build(common.read_input(2))

result1 = check_solve(data)
print(result1)
assert result1 == 45158


def line_div(line):
    for i in line:
        for j in line:
            if i != j and i % j == 0:
                return i // j


def div_solve(lines):
    return sum(map(line_div, lines))


result2 = div_solve(data)
print(result2)
assert result2 == 294
