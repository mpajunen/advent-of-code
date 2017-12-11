import operator

import common

day = 10
raw_data = common.read_input(day)


def knot(lengths, element_count=256, iterations=1):
    skip = 0
    position = 0
    elements = list(range(0, element_count))

    for i in range(iterations):
        for length in lengths:
            glued = elements[position:] + elements[:position]
            revved = glued[:length][::-1] + glued[length:]
            elements = revved[-position:] + revved[:-position]

            position = (position + length + skip) % element_count
            skip += 1

    return elements


def solve1(incoming):
    data = common.process_list(
        incoming.split(','),
        modify=int,
    )

    elements = knot(data)

    return elements[0] * elements[1]


result1 = solve1(raw_data)
print(result1)
assert result1 == 1935


def dense(sparse):
    result = 0

    for num in sparse:
        result = operator.xor(result, num)

    return hex(result)[2:].rjust(2, '0')


def solve2(incoming):
    data = common.process_list(
        list(incoming),
        modify=ord,
    ) + [17, 31, 73, 47, 23]

    elements = knot(data, iterations=64)

    segments = common.segment_list(elements, 16)
    packed = list(map(dense, segments))

    return ''.join(packed)


result2 = solve2(raw_data)
print(result2)
assert result2 == 'dc7e7dee710d4c7201ce42713e6b8359'
