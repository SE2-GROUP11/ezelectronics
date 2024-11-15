import csv

with open('table2.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    with open("table2.md", "w") as out:
        
        out.write("<table>\n")
        out.write("\t<thead>\n")
        out.write("\t\t<tr>\n")
        out.write("\t\t\t<th>Functional Requirement or scenario</th>\n")
        out.write("\t\t\t<th>Test(s)</th>\n")
        out.write("\t\t</tr>\n")
        out.write("\t</thead>\n")
        out.write("\t<tbody style='font-family:\"Courier New\"'>\n")
        
        for row in spamreader:
            out.write("\t\t<tr>\n")
            out.write(f"\t\t\t<td>{row[0]}</td>\n")
            
            if len(row[1]) != 0: 
                out.write("\t\t\t<td>\n")
                out.write("\t\t\t\t<ul>\n")
                
                for test in row[1].split("\n"):
                    out.write(f"\t\t\t\t\t<li>{test}</li>\n")
                
                out.write("\t\t\t\t</ul>\n")
                out.write("\t\t\t</td>\n")
            else:
                out.write("\t\t\t<td>-</td>\n")
                    
            out.write("\t\t</tr>\n")
        out.write("\t</tbody>\n")
