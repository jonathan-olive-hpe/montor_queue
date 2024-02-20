import puppeteer, { errors,  } from "puppeteer";
import * as path from "path";
import { sendMail } from "../utils/Transports";
//import { phoneNumbers, sendSMS, sendWhats } from "../utils/notifications";

type Status =
  | "On Hold"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "In Queue"
  | "Cancelled"
  | "New"
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
  let newPage:any = undefined
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
                  setInterval(async () => {
                newPage.reload().then(() => {
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
                    incidents.then(async (result:Incident[]) => {
                      incidentsArray = result;
                      if (isFirstScan) {
                        initial_list = result;
                      }
                      isFirstScan = false;
                      const newIncidents=result.filter((incident:Incident) => {
                        return incident?.status === "New" || incident.status === "In Queue"
                      });
                      if(newIncidents.length > 0){
                          let textMessage = `There are ${newIncidents.length} new incidents \n`
                          newIncidents.forEach((newIndicent,i)=>{
                            const line= `${i+1}-${newIndicent.number} - ${newIndicent.shortDescription} \n`;
                            textMessage += line;
                          })
                          try {
                            await sendMail([""],textMessage,textMessage)
                          } catch (error) {
                            console.log(error);
                          }
                          /*
                          phoneNumbers.forEach((person)=>{
                           // sendSMS(person.number,textMessage)
                          })
                          */
                      }
                      console.log(new Date().toString()," - newIncidentsArray - ", newIncidents);
                    });
                });
                  }, 60000);
              });
             const hearthBeatInterval = setInterval(()=>{
              //sendWhats("5214491879188","im alive")
             },1200000);
      });


  } catch (error) {
    console.error("line 23", error);
    process.exit();
  }
};
const monitorqueue=async()=>{

}