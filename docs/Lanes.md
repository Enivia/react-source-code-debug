与过期时间相比，Lanes 模型有两个主要优势

- lane 将任务优先级(“任务的 A 优先级是否高于任务 B?”)从任务批处理(“任务 A 是这组任务的一部分吗?”)的概念中解耦出来。
- lane 可以用一个 32 位的数据类型表示许多不同的任务线程。

在旧模型中，为了确定正在进行的批处理中是否包含指定的工作单元，我们将比较该工作单元与批处理的相对优先级:

```
const isTaskIncludedInBatch = priorityOfTask >= priorityOfBatch;
```

之所以这种方式可以达到目的，是因为我们是施加了一个约束，即在完成高优先级的任务之前，不允许处理较低优先级的任务。
假设优先级 A > B > C，你不能在没有 A 的情况下处理 B，如果没有 A 和 B，你也不能处理 C。

这种规则是在有任务挂起之前出现的，在这种场景里是有意义的，即当所有任务都是 CPU 密集型的任务时，必须按照优先级
来处理任务。但是，当你引入了 IO 密集型的任务（即挂起）时，可能会遇到这样的场景：高优先级的 IO 任务阻塞了
低优先级的 CPU 密集型任务的完成。

过期时间的一个缺陷是，它限制了我们表达一组多个优先级级别的方式。

无论从内存角度还是计算角度来看，使用 Set 对象都是不切实际的。这种优先级的检查非常多，所以它们需要速度快，
使用尽可能少的内存。

作为一种妥协，我们通常会做的是保持优先级的范围：

```javascript
const isTaskIncludedInBatch =
  taskPriority <= highestPriorityInRange && taskPriority >= lowestPriorityInRange;
```

但这种方式不是十全十美的，可以用它来标识一个封闭、连续的任务范围，但并不能区分出这个范围内的某个任务。例如，
指定一个任务范围，如何删除一个位于该范围中间的任务呢？即使已经有了一个不错的解决方案，用这种方式来寻找目标
任务也会变得混乱，并容易出现递归。

旧模型将优先级和批处理这两个概念结合成一个单一的数据类型。

在新的模型中，我们已经将这两个概念解耦了。任务组不是用相对数字表示，而是用位掩码表示：

```javascript
const isTaskIncludedInBatch = (task & batchOfTasks) !== 0;
```

> task & batchOfTasks 为位掩码运算（按位与 &），检查 batchOfTasks 中是否含有 task

表示任务的位掩码类型称为 Lane。表示批处理的位掩码的类型称为 Lanes。

**实际上无论 Lane 或者 Lanes 类型，都是 number 类型**

更具体地说，由 setState 调度的更新对象包含一个 lane 字段，它是一个启用了单个位的位掩码。这将替换旧模型中 update 的
expirationTime 字段。

另一方面，一个 fiber 并不只与单个更新相关联，而可能关联到多个更新。因此它有一个 lane 字段，一个启用零位或更多位
的位掩码(旧模型中的 fiber.expirationTime)；和一个 childLanes 字段(fiber.childExpirationTime)。

Lanes 是一种不透明类型。你只能在 ReactFiberLane 模块中执行直接的位掩码操作。在其他地方，必须从该模块导入相关的函数。
这是一种权衡，但我认为它最终是值得的，因为处理 lane 可能非常微妙，并且同步所有逻辑将使我们更容易调整我们的代码，
而不必每次都做巨大的重构(就像这样)。

## 常见的过期时间字段，将转换为 Leans

- renderExpirationtime -> renderLanes
- update.expirationTime -> update.lane
- fiber.expirationTime -> fiber.lanes
- fiber.childExpirationTime -> fiber.childLanes
- root.firstPendingTime and root.lastPendingTime -> fiber.pendingLanes
