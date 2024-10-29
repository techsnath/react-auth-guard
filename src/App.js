import { createContext, useEffect, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useNavigate,
} from 'react-router-dom';

function HomePage() {
  return <h1>Home</h1>;
}

function AboutUsPage() {
  return <h1>About us</h1>;
}

function TaskBoardPage() {
  return <h1>Task Board</h1>;
}

function ManageTaskPage() {
  const user = useContext(AuthContext);
  useIAM(user);
  return (
    <>
      <h1>Manage Task</h1>
      <ul>
        <li>
          <Link to='create'>Create Task</Link>
        </li>
        <li>
          <Link to='schedule'>Schedule Task</Link>
        </li>
      </ul>
      <Outlet />
    </>
  );
}

function CreateTaskPage() {
  return <h1>Create Task</h1>;
}

function ScheduleTaskPage() {
  return <h1>Schedule Task</h1>;
}

function LoginPage() {
  return <h1>Login</h1>;
}

function SignupPage() {
  return <h1>Signup</h1>;
}

function NoPage() {
  return <h1>No Page found</h1>;
}

function useAuthGuard(user) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
    }
  }, [user?.id]);
}

function useIAM(data) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!data.user?.role) {
      navigate('/home');
    }
    if (data.user?.role && data.user?.role !== 'admin') {
      navigate('/task-board');
    }
  }, [data.user?.role]);
}

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const user = {

  };

  // const user = {
  //   id: Math.random(),
  //   role: 'user', 
  // };

  // const user = {
  //   id: Math.random(),
  //   role: 'admin', // user role - admin, user
  // };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

function AppLayout() {
  const data = useContext(AuthContext);
  useAuthGuard(data);
  return (
    <>
      <nav>
        <Link to='/'>Home</Link> |
        <Link to='about-us'>About us</Link> |
        <Link to='task-board'>Task Board</Link> |
        {data.user.role === 'admin' && (
          <><Link to='manage-task'>Manage Task</Link> |</>
        )}
        {!data.user.id && (
          <>
            <Link to='login'>Login</Link>  |
            <Link to='signup'>Signup</Link>  |
          </>

        )}
      </nav>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path='about-us' element={<AboutUsPage />} />
            <Route path='task-board' element={<TaskBoardPage />} />
            <Route path='manage-task' element={<ManageTaskPage />}>
              <Route path='create' element={<CreateTaskPage />} />
              <Route path='schedule' element={<ScheduleTaskPage />} />
            </Route>
            <Route path='login' element={<LoginPage />} />
            <Route path='signup' element={<SignupPage />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
