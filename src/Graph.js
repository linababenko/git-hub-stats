import React, { useContext } from 'react';
import { VictoryBar, VictoryChart, VictoryLabel } from 'victory';
import { UserDataContext } from "./SelectForm"

function Graph() {
    const { userActivity } = useContext(UserDataContext)

    return (
        <div>
            <VictoryChart
                width={1200}
                height={1000}
                domainPadding={10}
            >
                <VictoryBar horizontal
                            style={{
                                data: { fill: "rgb(69, 178, 157)" },
                                labels: { fill: "black" }
                            }}
                            alignment="start"
                            data={userActivity}
                            y="cumulateTotal"
                            labels={({ datum }) => datum.created_at}
                            labelComponent={<VictoryLabel dy={0}/>}
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 500 }
                            }}
                />
            </VictoryChart>
        </div>

    )
}

export default Graph;
