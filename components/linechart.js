// Based on below references
// https://d3-graph-gallery.com/graph/line_basic.html
// .. and resolved come challenges with ChatGPT.

class Linechart {
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = 350, height = 250) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");

        this.xScale = d3.scaleTime();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(data) {
        const parseDate = d3.timeParse("%m/%d/%Y");
        const formatDate = d3.timeFormat("%m");

        const filteredData = data.map(row => ({
            date: parseDate(row.date),
        }));

        const months = d3.rollups(filteredData, v => v.length, d => formatDate(d.date))
                         .map(([key, value]) => ({ 
                            date: d3.timeParse("%m")(key), 
                            posts: value 
                        }));

        months.sort((a, b) => d3.ascending(a.date, b.date))

        this.xScale.domain(d3.extent(months, d => d.date)).range([0, this.width]);
        this.yScale.domain([0, d3.max(months, d => d.posts)]).range([this.height, 0]);

        this.container.append("path")
                      .datum(months)
                      .attr("fill", "none")
                      .attr("stroke", "steelblue")
                      .attr("stroke-width", 1.5)
                      .attr("d", d3.line()
                                   .x(d => this.xScale(d.date))
                                   .y(d => this.yScale(d.posts))
                    );

        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat("%b")));

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));
    }
}