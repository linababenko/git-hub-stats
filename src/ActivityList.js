import React, { useContext } from 'react';
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { UserDataContext } from "./SelectForm"

function ActivityList() {
    const { userActivity } = useContext(UserDataContext)
    return (
        <div style={{ width: "448px", height: 800, marginTop: "15px" }}>
            <div
                id="Grid"
                style={{
                    height: '100%',
                    width: '100%',
                }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                    rowData={userActivity}
                    groupHeaderHeight={75}
                    floatingFiltersHeight={50}
                    pivotGroupHeaderHeight={50}
                    pivotHeaderHeight={100}>
                    <AgGridColumn
                        width={120}
                        suppressSizeToFit={true}
                        headerName="Date"
                        field="created_at"/>
                    <AgGridColumn
                        width={150}
                        headerName="Real activity"
                        field="total"/>
                    <AgGridColumn
                        width={170}
                        headerName="Cumulative activity"
                        field="cumulateTotal"/>
                </AgGridReact>
            </div>
        </div>
    );
}

export default ActivityList;
