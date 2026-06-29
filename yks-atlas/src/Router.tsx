import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import TasksPage from '@/pages/TasksPage';
import SubjectsPage from '@/pages/SubjectsPage';
import ExamsPage from '@/pages/ExamsPage';
import MistakesPage from '@/pages/MistakesPage';
import BooksPage from '@/pages/BooksPage';
import NotesPage from '@/pages/NotesPage';
import PomodoroPage from '@/pages/PomodoroPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/tasks',
    element: <TasksPage />,
  },
  {
    path: '/subjects',
    element: <SubjectsPage />,
  },
  {
    path: '/exams',
    element: <ExamsPage />,
  },
  {
    path: '/mistakes',
    element: <MistakesPage />,
  },
  {
    path: '/books',
    element: <BooksPage />,
  },
  {
    path: '/notes',
    element: <NotesPage />,
  },
  {
    path: '/pomodoro',
    element: <PomodoroPage />,
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
