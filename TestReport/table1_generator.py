import csv

with open('table1.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    with open("table1.md", "w") as out:
        out.write("| Test case name | Object(s) tested | Test level | Technique used |\n")
        out.write("| :------------- | :--------------- | :--------: | :------------: |\n")
        for row in spamreader:
            out.write(f"| {' | '.join(row)} |\n")
