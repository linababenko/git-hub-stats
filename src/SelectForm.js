import React, { useState } from "react";
import Select from 'react-select'
import ActivityList from "./ActivityList"
import Graph from "./Graph"

import './SelectForm.css'
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();

const names = [
    { value: 'boivlad', label: 'boivlad' },
    { value: 'ArtemFrantsiian', label: 'ArtemFrantsiian' },
    { value: 'Richardowsky', label: 'Richardowsky' }
]

const UserDataContext = React.createContext();

function SelectForm() {
    const [userData, setUserData] = useState([]);

    const value = {
        userActivity: userData,
    }

    async function getGithubUsers(name) {

        function addMonths(date, months) {
            date.setMonth(date.getMonth() + months);
            return date;
        }

        const dateBefore = addMonths(new Date(), -6);

        let eventsResult = [];
        let eventsReceivedResult = [];

        let page = 0;
        while (true) {
            page++;
            let events = await octokit.request(`GET /users/${name}/events?per_page=100&page=${page}`)
            let received = await octokit.request(`GET /users/${name}/received_events?per_page=100&page=${page}`)

            events.data.map((i) => {
                if (i.created_at > dateBefore.toISOString()) {
                    return eventsResult.push(i)
                }
            });
            received.data.map((i) => {
                if (i.created_at > dateBefore.toISOString()) {
                    return eventsReceivedResult.push(i)
                }
            });
            if (events.data.length < 100 && received.data.length < 100) break
        }
        const result = [...eventsResult, ...eventsReceivedResult];
        await sortByData(result)
    }

    async function sortByData(nonSortedData) {
        let sortedArray = nonSortedData.sort((a, b) => {
            return a.id - b.id;
        });
        sortedArray.map((i) => {
            return i.created_at = i.created_at.split("T")[0]
        });
        await findClone(sortedArray)
    }

    function findClone(data) {
        const counter = data.reduce((obj, item) => {
            if (!obj.hasOwnProperty(item.created_at)) {
                obj[item.created_at] = 0;
            }
            obj[item.created_at]++;
            return obj;
        }, {});
        const parsed = Object.keys(counter).map((i) => {
            return { created_at: i, total: counter[i] };
        });
        cumulate(parsed)
    }

    function cumulate(data) {
        const addCumulateTotal = data.map((i) => {
            return {
                created_at: i.created_at,
                total: i.total,
                cumulateTotal: i.total
            }
        });
        for (let i = 1; i < addCumulateTotal.length; i++) {
            addCumulateTotal[i].cumulateTotal = addCumulateTotal[i].cumulateTotal + addCumulateTotal[i - 1].cumulateTotal
        }
        return setUserData(addCumulateTotal)
    }


    function handleChange(event) {
        getGithubUsers(event.value)
    }

    return (
        <UserDataContext.Provider value={value}>
            <div>
                <div className="col-1-2">
                    <Select
                        options={names}
                        onChange={handleChange}
                    />
                    <ActivityList/>
                </div>
                <div className="col-1-3">
                    <Graph/>
                </div>
            </div>
        </UserDataContext.Provider>
    );

}

export {
    SelectForm,
    UserDataContext
};

