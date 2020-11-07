import styled from 'styled-components'

export const Table = styled.table`

    border: 4px solid black;
    border-radius: 20px;
    min-height: 300px;
    position: relative;
    background-color: black;

    th {
       background-color: #b6be9c;
       padding-left: 20px; 
       padding-right: 20px;
       font-size: 17px;
       border: 1px solid black;
       border-radius: 20px;
    }

    #corner {
        background-color: #edefe6
    }

    .week-data {
        background-color: #b6be9c;
        padding-left: 20px; 
        padding-right:20px;
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        border: 1px solid black;
        font-weight: bold;
        span {
            opacity: 0.5
        }
    }

`
type cellProps = {
    percent: number
}
 
export const Cell = styled.td<cellProps>`

        padding-left: 20px; 
        padding-right:20px;
        border-radius: 20px;
        border: 1px solid black;
        background-color: ${({percent})  => {
            if (percent < 20) return '#d8f3dc'
            else if (percent < 40) return '#b7e4c7' 
            else if (percent < 60) return '#95d5b2'
            else if (percent < 80) return '#74c69d'
            else if (percent < 100) return '#52b788'
            else return '#40916c'
        }};
        font-weight: ${({percent})  => {
            if (percent < 30) return 'lighter'
            else if (percent < 60) return 'medium' 
            else if (percent < 90) return 'bold'
            else return 'bolder'
        }};
`