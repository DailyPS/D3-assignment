class DataTable {
    constructor(id) {
        this.id = id;
    }

    update(data, columns) {
        let table = d3.select(this.id);

        const filteredData = data.map(row => ({
            column1: row.date,
            column2: row.time,
            column3: row.title
        }));

        // TODO: create as many <tr>s as rows
        let rows = table
            .selectAll("tr")
            .data(filteredData)
            .join("tr")

        // TODO: populate <td>s in each row    
        rows.selectAll("td")
            .data(d => Object.values(d))
            .join("td")
            .text(d => d);
    }
}

