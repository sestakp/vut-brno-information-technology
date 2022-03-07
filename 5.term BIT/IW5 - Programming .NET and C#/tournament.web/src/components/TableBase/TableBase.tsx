import { connect, ConnectedProps } from 'react-redux';
import {RootState} from "../../app/store";

// alternately, declare `type Props = PropsFromRedux & {backgroundColor: string}`
interface Props extends PropsFromRedux {
    
}
  
const MyComponent: React.FC<Props> = (props: Props) => {
    return(
       <>
        <text>Hello</text>
       </>
    )
}


const mapState = (state: RootState) => ({
    isOn: false,
})

const mapDispatch = {
    toggleOn: () => ({ type: 'TOGGLE_IS_ON' }),
}

const connector = connect(mapState, mapDispatch)
  
type PropsFromRedux = ConnectedProps<typeof connector>
  
export default connector(MyComponent)