import common

day = 1
data = common.read_input(day, char_split=True)

def solve(digits, offset):
    next_digits = digits[offset:] + digits[:offset]
    pairs = zip(digits, next_digits)
    matches = [i for (i, j) in pairs if i == j]

    return sum(matches)


result1 = solve(data, 1)
print(result1)
assert result1 == 997


def solve_halfway(digits):
    return solve(digits, len(digits) // 2)


assert solve_halfway([1, 2, 1, 2]) == 6


result2 = solve_halfway(data)
print(result2)
assert result2 == 1358
