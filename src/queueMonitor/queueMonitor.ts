import puppeteer, { errors, Page } from "puppeteer";
import * as path from "path";
const pathtoParentDirectory = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "debug-image.png"
);
type Status =
  | "On Hold"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "In Queue"
  | "Cancelled"
  | "Default";

interface Incident {
  number?: string;
  status: Status;
  assignedTo?: string;
  opened?: string;
  shortDescription?: string;
  description?: string;
}

export const queueMonitor = async () => {
  //VARIABLES
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  let newPage: Page;
  let snowUrl =
    "https://hpe.service-now.com/incident_list.do?sysparm_userpref_module=172a63dedbc86300d82a49ee3b961953&sysparm_query=stateNOT+IN6%2C7%2C8%5Eassignment_groupDYNAMICd6435e965f510100a9ad2572f2b47744%5EEQ";
  let incidentsArray: Incident[] = [];
  let initial_list: Incident[] = [];
  let isFirstScan = true;

  // init
  try {
    page.goto(snowUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  } catch (error) {
    if (error instanceof errors.TimeoutError) {
      console.log("error on line 15");
      process.exit();
    }
    process.exit();
  }

  try {
    await page
      .waitForNavigation({ waitUntil: "networkidle0",timeout:60000 })
      .then(async () => {
        //once open the main page open the secondary to get the table withont iframe
        newPage = await browser.newPage();
        newPage
          .goto(snowUrl, { waitUntil: "domcontentloaded", timeout: 60000 })
          .then(() => {
                newPage.reload().then(() => {
                  setInterval(async () => {
                    const incidents = newPage.evaluate(() => {
                      const incidentsArray: Incident[] = [];
                      const body = document.body;
                      const wrapper = body.querySelector(".list_wrap_n_scroll");
                      const incident_list = wrapper
                        ?.querySelector("#incident_list")
                        ?.querySelector("#incident_expanded")
                        ?.querySelector(".list_div_parent");
                      const incident_table = incident_list
                        ?.querySelector("#incident")
                        ?.querySelector("#incident_table");
                      const incidents_node = incident_table
                        ?.querySelector("tbody")
                        ?.querySelectorAll("tr");

                      incidents_node?.forEach((incidentRow) => {
                        const incidentObj: Incident = {
                          status: "Default",
                          assignedTo: "",
                          description: "",
                          number: "",
                          opened: "",
                          shortDescription: "",
                        };
                        const columns = Array.from(
                          incidentRow.querySelectorAll("td")
                        );
                        incidentObj.number =
                          columns[2].querySelector("a")?.innerText || "";
                        incidentObj.assignedTo =
                          columns[4].querySelector("a")?.innerText || "";
                        incidentObj.opened = columns[6]?.innerText || "";

                        incidentObj.shortDescription =
                          columns[8].innerText || "";
                        incidentObj.description = columns[9].innerText || "";
                        const statusText = columns[3]!.innerText as Status;
                        incidentObj.status = [
                          "Cancelled",
                          "On Hold",
                          "Assigned",
                          "New",
                          "In Progress",
                        ].includes(statusText)
                          ? statusText
                          : ("Default" as Status);
                        incidentsArray.push(incidentObj);
                      });
                      return incidentsArray;
                    });
                    incidents.then((result) => {
                      incidentsArray = result;
                      if (isFirstScan) {
                        initial_list = result;
                      }
                      isFirstScan = false;
                      result.filter((incident) => {
                        incident?.status === "On Hold";
                      });
                      console.log("incidentsArray", incidentsArray);
                    });
                  }, 20000);
                });
              });
          
      });
  } catch (error) {
    console.error("line 23", error);
    process.exit();
  }
};
const monitorqueue=async()=>{

}