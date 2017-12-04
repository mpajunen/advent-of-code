import common


def build(lines):
    return [list(line.split()) for line in lines]


def has_unique_words(words):
    return len(set(words)) == len(words)


def solve_unique(phrases):
    return len(list(filter(has_unique_words, phrases)))


data = build(common.read_input(4))

print(solve_unique(data))
# 383


def sort_word(word):
    return ''.join(sorted(word))


def has_no_anagrams(words):
    return has_unique_words(list(map(sort_word, words)))


def solve_no_anagrams(phrases):
    return len(list(filter(has_no_anagrams, phrases)))


print(solve_no_anagrams(data))
