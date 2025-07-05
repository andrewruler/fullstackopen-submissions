import Header from './Header'
import Content from './Content'

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            {course.parts.map((part) => <Content part={part} key = {part.id}/>)}
            <h1>Total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)}</h1>
        </div>
    )
}

export default Course; 