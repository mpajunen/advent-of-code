import operator

from common.collection import segment_list


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


def dense(sparse):
    result = 0

    for num in sparse:
        result = operator.xor(result, num)

    return result


def knot_bytes(characters):
    data = list(map(ord, characters)) + [17, 31, 73, 47, 23]

    elements = knot(data, iterations=64)

    segments = segment_list(elements, 16)

    return list(map(dense, segments))
