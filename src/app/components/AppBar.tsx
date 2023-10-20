import {
  AppBar as MuiAppBar,
  Box,
  Button,
  styled,
  Typography,
} from '@mui/material';
import { UserInfo } from '@web3auth/base';
import Link from 'next/link';

type AppBarProps = {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userInfo?: Partial<UserInfo>;
  city: any;
};

const AppBar = ({
  isLoggedIn,
  onLogin,
  onLogout,
  userInfo,
  city,
}: AppBarProps) => {
  return (
    <StyledAppBar position='static' className='z-100 m-auto' color='default'>
      <div className='z-10 m-auto flex w-full max-w-[1300px] items-center justify-between px-10'>
        <Typography variant='h3' pl={4} fontWeight={700} className='flex'>
          <Link href='/' className='hover:underline'>
            Nomad guides{' '}
          </Link>
          {city && city.slug ? (
            <div className='flex'>
              <div className='mx-2'>/</div>
              <Link
                href={`/${city.slug}`}
                className=' hover:underline'
              >{`${city.name}`}</Link>
            </div>
          ) : null}
        </Typography>

        <Box mr={5}>
          {isLoggedIn ? (
            <Box display='flex' alignItems='center'>
              {userInfo && (
                <Typography variant='body1' fontWeight={700}>
                  Hello {userInfo.name || userInfo.email} !!
                </Typography>
              )}
              <Button variant='contained' onClick={onLogout} sx={{ ml: 2 }}>
                Log Out
              </Button>
            </Box>
          ) : (
            <Button variant='contained' onClick={onLogin}>
              Login
            </Button>
          )}
        </Box>
      </div>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(MuiAppBar)`
  && {
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.palette.background.paper};
    height: 70px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    border-bottom: 2px solid ${({ theme }) => theme.palette.background.paper};
    box-shadow: none;
    z-index: 100;
  }
`;

export default AppBar;
