import common


def build(lines):
    return [list(map(int, line.split())) for line in lines]


def checksum(line):
    return max(line) - min(line)


def check_solve(lines):
    return sum(map(checksum, lines))


data = build(common.read_input(2))

print(check_solve(data))
# 45158


def line_div(line):
    for i in line:
        for j in line:
            if i != j and i % j == 0:
                return i // j


def div_solve(lines):
    return sum(map(line_div, lines))


print(div_solve(data))
# 294
