import common


def build(lines):
    return [list(line.split()) for line in lines]


def has_unique_words(words):
    return len(set(words)) == len(words)


def solve_unique(phrases):
    return len(list(filter(has_unique_words, phrases)))


data = build(common.read_input(4))

result1 = solve_unique(data)
print(result1)
assert result1 == 383


def sort_word(word):
    return ''.join(sorted(word))


def has_no_anagrams(words):
    return has_unique_words(list(map(sort_word, words)))


def solve_no_anagrams(phrases):
    return len(list(filter(has_no_anagrams, phrases)))


result2 = solve_no_anagrams(data)
print(result2)
assert result2 == 265
