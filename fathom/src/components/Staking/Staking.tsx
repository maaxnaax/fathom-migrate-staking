//import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import { observer } from "mobx-react";
import { Paper, Typography } from "@mui/material";
import CustomizedDialogs from "../Positions/OpenNewPositionDialog";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import Button from '@mui/material/Button';
import useMetaMask from '../../hooks/metamask';
import { useStores } from '../../stores';

// interface PoolProps {
//   pool: ICollatralPool;
// }

const StakingView = observer(() => {


    let stakingStore = useStores().stakingStore;

    const { account } = useMetaMask()!

    const createNewLock = () => {
        stakingStore.createLock(account, 500, 0)
        }

    return (
        <Paper
        sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
        }}
        >
        <Button autoFocus onClick={createNewLock}>
         createLock
        </Button>
        </Paper>
    );
});

export default StakingView;
