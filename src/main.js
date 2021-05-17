import { Application } from 'stimulus'
import './style.css'
import { ApplicationController } from './controllers/application-controller.js'
import { FieldController } from './controllers/field-controller.js'
import { CourseController } from './controllers/course-controller.js'
import { ButtonController } from './controllers/button-controller.js'

const app = new Application()
app.register('app', ApplicationController)
app.register('field', FieldController)
app.register('course', CourseController)
app.register('button', ButtonController)
app.start()
