from operator import itemgetter

N_NFR_before = 10
N_FR_before = 3


class NFR:
    def __init__(self, type, descr, FR) -> None:
        self.type = type
        self.descr = descr
        self.FR = FR

    def __lt__(self, obj):
        return (self.type) < (obj.type)

    def __gt__(self, obj):
        return (self.type) > (obj.type)

    def __le__(self, obj):
        return (self.type) <= (obj.type)

    def __ge__(self, obj):
        return (self.type) >= (obj.type)

    def __eq__(self, obj):
        return self.type == obj.type


def nfr():
    NFRs.sort()
    for index, NFR in enumerate(NFRs):
        FR = ", ".join(
            [
                f"{fr[0]+N_FR_before}{'.'+str(fr[1]) if len(fr) > 1 else ''}"
                for fr in NFR.FR
            ]
        )
        print(f"| NFR{N_NFR_before + index+1} | {NFR.type} | {NFR.descr} | FR {FR} |")


NFRs = [
    NFR(
        "Usability",
        "No learning time for payment methods, if customer has already used them on other websites",
        [(1, 4), (1, 5), (1, 6), (1, 7)],
    ),
    NFR(
        "Usability",
        "No learning time for delivery, if customer has already used them on other websites",
        [(2,)],
    ),
    NFR(
        "Usability",
        "Store owner should be proficient in managing stock after 1 week of usage",
        [(3,)],
    ),
    NFR(
        "Usability",
        "Customer support should be intuitive, no learning time required to use it",
        [(4,)],
    ),
    NFR(
        "Reliability",
        "All services should be operational for at least 95% of the whole website uptime",
        [(1,), (2,), (3,), (4,)],
    ),
    NFR(
        "Scalability",
        "At any time, all services should be able to witstand a sudden increase of 10% of the average number of users",
        [(1,), (2,), (3,), (4,)],
    ),
    NFR(
        "Efficiency",
        "Payment confirmation should take less than 1s",
        [(1, 5), (1, 6), (1, 7)],
    ),
    NFR(
        "Efficiency",
        "Statistics on products should be computed in less than 1s",
        [(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7)],
    ),
    NFR(
        "Efficiency",
        "FAQs should include the top 90% asked questions",
        [(4, 1)],
    ),
    NFR(
        "Efficiency",
        "Only 10% of chatbot customers should be forwarded to live chat/ticketing (all the others must be satisfied with the chatbot)",
        [(4, 2)],
    ),
    NFR(
        "Efficiency",
        "Manual help should respond via ticket in at most 1 working day",
        [(4, 3)],
    ),
    NFR(
        "Portability",
        "Adding a new payment system or updating the API of an existing one should take no longer than 2 man-weeks",
        [(1,)],
    ),
    NFR(
        "Maintainability",
        "Adding a new product to the stock should take no longer than the time required to fill all its details",
        [(3,)],
    ),
    NFR(
        "Security",
        "Payment data should be secured according to the current law at any time",
        [(1, 5), (1, 6), (1, 7)],
    ),
    NFR(
        "Security",
        "Automatic stock reordering should have a maximum, to avoid extremely large orders made by mistake",
        [(3, 8), (3, 9)],
    ),
]


if __name__ == "__main__":
    nfr()
