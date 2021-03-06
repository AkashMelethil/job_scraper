import { EndpointData, fetchDataFromEndpointURL, retrieveTagsFromString } from "./endpoint"

const REMOTEOK_MAX_NUM_RECORDS = 500
const REMOTEOK_BASE_URL = "https://remoteok.io"
const REMOTEOK_DATA_URL = REMOTEOK_BASE_URL + "/remote-dev-jobs/"
const ID_PREFIX = "remoteok-"

function fetchDataFromRemoteOK():EndpointData {
    const $:CheerioStatic = fetchDataFromEndpointURL(REMOTEOK_DATA_URL)

    let remoteOKData = []
    let remoteOKLinks = []
    $("#jobsboard tr.job").each(function(index) {
        const row = $(this)
        let rowData = []

        const id:string = ID_PREFIX + row.attr("data-id")
        const toURL:string = row.attr("data-href")
        const tags:string = row.attr("data-search")

        rowData.push(id)

        const details = JSON.parse(row.find("td.image script[type='application/ld+json']").html())
        let title:string = ""
        if (details !== null && details["jobLocationType"] === "TELECOMMUTE") {
            const postingDate:string = (new Date(details["datePosted"])).toDateString()
            const deadlineDate:string = (new Date(details["validThrough"])).toDateString()
            title = details["title"]
            const companyName:string = details["hiringOrganization"]["name"].trim()
            const companyLocationStr:string = details["jobLocation"]["address"]["addressCountry"].trim()
            const companyLocation = (companyLocationStr === "Anywhere"? "" : companyLocationStr.trim())
            const compensation:string = details["baseSalary"]["value"].trim()
            const experienceLevel:string = ""
            const description:string = tags + details["description"].trim()
            const keyQualifications:string = retrieveTagsFromString(description).toArray().join(", ")
            const commitmentStr:string = details["employmentType"].trim()
            const commitment:string = (commitmentStr === "FULL_TIME"? "Full Time":commitmentStr.trim())
            const hours:string = details["workHours"].trim()
            const appliedDate:string = ""

            rowData.push(postingDate)
            rowData.push(deadlineDate)
            rowData.push(title)
            rowData.push(companyName)
            rowData.push(companyLocation)
            rowData.push(compensation)
            rowData.push(experienceLevel)
            rowData.push(keyQualifications)
            rowData.push(commitment)
            rowData.push(hours)
            rowData.push(appliedDate)
        }
        else {
            Logger.log("Error, null value found at index %s.", index)
            return false
        }

        remoteOKData.push(rowData)
        remoteOKLinks.push(['=HYPERLINK("'+ REMOTEOK_BASE_URL + toURL +'","'+ title +'")'])

        if (index == REMOTEOK_MAX_NUM_RECORDS) return false
    })

    Logger.log("# of Records: " + remoteOKData.length)

    return {
        data: remoteOKData,
        links: remoteOKLinks
    }
}

export {
    fetchDataFromRemoteOK
}
