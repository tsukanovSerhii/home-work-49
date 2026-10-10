import './App.css'
import Header from './components/Header'
import UserProfile from './components/UserProfile'
import PostList from './components/PostList'

function App() {
  return (
    <div className="App">
      <Header />
      <div className="dashboard-grid">
        <UserProfile />
        <PostList />
      </div>
    </div>
  )
}

export default App
