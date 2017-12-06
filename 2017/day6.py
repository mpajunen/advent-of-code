import common

day = 6
data = common.read_input(day)


def distribute(position):
    position_count = len(position)
    max_pos = max(enumerate(position), key=lambda x: x[1])[0]
    max_val = position[max_pos]

    new_position = position[:max_pos] + [0] + position[(max_pos + 1):]
    for k in range(max_pos + 1, max_val + max_pos + 1):
        new_position[k % position_count] += 1

    return new_position


(length, start) = common.tortoise_and_hare(distribute, data)

result1 = start + length
print(result1)
assert result1 == 3156

result2 = length
print(result2)
assert result2 == 1610
